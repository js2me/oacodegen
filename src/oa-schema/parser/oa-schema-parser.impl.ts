import { compact, each, get, merge, uniq } from 'lodash-es';
import { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import swagger2openapi, { ConvertInputOptions } from 'swagger2openapi';
import { AnyObject } from 'yammies/utils/types';

import { OAInternalSchemaImpl } from '../../oa-internal-schema/oa-internal-schema.impl.js';
import { OAInternalSchema } from '../../oa-internal-schema/oa-internal-schema.js';
import { LoggerImpl } from '../../utils/logger/logger.impl.js';
import { Logger } from '../../utils/logger/logger.js';

import { OASchemaParser } from './oa-schema-parser.js';
import {
  OA3ModifiedDocument,
  OASchemaParserConfig,
  OASchemaParserParseParams,
} from './oa-schema-parser.types.js';

export class OASchemaParserImpl implements OASchemaParser {
  protected logger: Logger;

  constructor(protected config: OASchemaParserConfig) {
    this.logger = new LoggerImpl({
      engine: config.engine,
      name: 'oas-schema-parser',
    });
  }

  applySchemaModifications({
    usageSchema,
    originalSchema,
  }: {
    originalSchema: AnyObject;
    usageSchema: AnyObject;
  }): OA3ModifiedDocument {
    const result = structuredClone(usageSchema) as OA3ModifiedDocument;

    result['__original'] = originalSchema;

    return result;
  }

  applySchemaFixes({
    usageSchema,
    originalSchema,
  }: {
    originalSchema: AnyObject;
    usageSchema: AnyObject;
  }): OpenAPIV3.Document {
    const result = structuredClone(usageSchema);

    const usagePaths = get(result, 'paths');
    const originalPaths = get(originalSchema, 'paths');

    // walk by routes
    each(usagePaths, (usagePathObject, route) => {
      const originalPathObject = get(originalPaths, route);

      // walk by methods
      each(usagePathObject, (usageRouteInfo, methodName) => {
        const originalRouteInfo = get(originalPathObject, methodName);
        const usageRouteParams = get<OpenAPIV3.ParameterObject[]>(
          usageRouteInfo,
          'parameters',
          [],
        );
        const originalRouteParams = get<OpenAPIV3.ParameterObject[]>(
          originalRouteInfo,
          'parameters',
          [],
        );

        if (typeof usageRouteInfo === 'object') {
          usageRouteInfo.consumes = uniq(
            compact([
              ...(usageRouteInfo.consumes || []),
              ...(originalRouteInfo.consumes || []),
            ]),
          );
          usageRouteInfo.produces = uniq(
            compact([
              ...(usageRouteInfo.produces || []),
              ...(originalRouteInfo.produces || []),
            ]),
          );
        }

        each(originalRouteParams, (originalRouteParameter) => {
          const existUsageParameter = usageRouteParams.find(
            // eslint-disable-next-line sonarjs/no-nested-functions
            (parameter) =>
              originalRouteParameter.in === parameter.in &&
              originalRouteParameter.name === parameter.name,
          );
          if (!existUsageParameter) {
            usageRouteParams.push(originalRouteParameter);
          }
        });
      });
    });

    return result as OpenAPIV3.Document;
  }

  convertToOA3(
    schema: AnyObject,
    options?: Partial<ConvertInputOptions>,
  ): Promise<OpenAPIV3.Document> {
    return new Promise<OpenAPIV3.Document>((resolve) => {
      swagger2openapi.convertObj(
        schema as unknown as OpenAPIV2.Document,
        {
          warnOnly: true,
          refSiblings: 'preserve',
          rbname: 'requestBodyName',
          ...options,
        },
        (result, options) => {
          const parsedSwaggerSchema = get(
            result,
            'options.openapi',
            get(options, 'openapi'),
          );

          if (!parsedSwaggerSchema && result) {
            throw result;
          }

          resolve(parsedSwaggerSchema);
        },
      );
    });
  }

  async parse({
    schema: originalSchema,
    converterOptions,
  }: OASchemaParserParseParams): Promise<OAInternalSchema> {
    let resultSchema = structuredClone(
      originalSchema,
    ) as unknown as OpenAPIV3.Document;

    resultSchema.info = merge(
      {
        title: 'No title',
        version: '',
      },
      resultSchema.info,
    );

    if (Object.hasOwn(resultSchema, 'openapi')) {
      resultSchema = this.applySchemaFixes({
        originalSchema,
        usageSchema: resultSchema,
      });
    } else {
      resultSchema.paths = merge({}, resultSchema.paths);

      const convertedToOA3 = await this.convertToOA3(
        resultSchema,
        converterOptions,
      );

      resultSchema = this.applySchemaFixes({
        originalSchema,
        usageSchema: convertedToOA3,
      });
    }

    resultSchema = this.applySchemaModifications({
      originalSchema,
      usageSchema: resultSchema,
    });

    return new OAInternalSchemaImpl({
      schema: resultSchema,
      engine: this.config.engine,
      schemaAddress: '#',
    });
  }
}
