import expressJsdocSwagger from "express-jsdoc-swagger";

export function initDocs(app) {
  const options = {
    openapi: "3.0.0",
    info: {
      title: "API Coffeeder",
      version: "1.0.0",
      description: "Dokumentasi API backend Coffeeder",
    },
    baseDir: process.cwd(),
    filesPattern: "./src/controllers/**/*.js",

    swaggerUIPath: "/api-docs",
    exposeSwaggerUI: true,
    
    swaggerUiOptions: {
      explorer: true,
    },
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    
    security: [
      {
        bearerAuth: []
      }
    ],
  };

  const instance = expressJsdocSwagger(app)(options);

  instance.on('finish', (swaggerDef) => {
    swaggerDef.components = swaggerDef.components || {};
    swaggerDef.components.securitySchemes = {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    };

    swaggerDef.security = [{ bearerAuth: [] }];

    if (swaggerDef.paths['/products'] && swaggerDef.paths['/products'].post) {
      swaggerDef.paths['/products'].post.security = [{ bearerAuth: [] }];
      
      swaggerDef.paths['/products'].post.requestBody = {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                title: { 
                  type: 'string',
                  description: 'Product title'
                },
                description: { 
                  type: 'string',
                  description: 'Product description'
                },
                base_price: { 
                  type: 'number',
                  description: 'Base price'
                },
                stock: { 
                  type: 'number',
                  description: 'Stock quantity'
                },
                categoryIds: { 
                  type: 'string',
                  description: 'Category IDs (comma-separated)'
                },
                sizeIds: { 
                  type: 'string',
                  description: 'Size IDs (comma-separated)'
                },
                variantIds: { 
                  type: 'string',
                  description: 'Variant IDs (comma-separated)'
                },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  },
                  description: 'Product images'
                }
              },
              required: ['title', 'base_price']
            }
          }
        }
      };
    }

    if (swaggerDef.paths['/products/{id}'] && swaggerDef.paths['/products/{id}'].patch) {
      swaggerDef.paths['/products/{id}'].patch.security = [{ bearerAuth: [] }];
      
      swaggerDef.paths['/products/{id}'].patch.requestBody = {
        required: false,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                title: { 
                  type: 'string',
                  description: 'Product title'
                },
                description: { 
                  type: 'string',
                  description: 'Product description'
                },
                base_price: { 
                  type: 'number',
                  description: 'Base price'
                },
                stock: { 
                  type: 'number',
                  description: 'Stock quantity'
                },
                categoryIds: { 
                  type: 'string',
                  description: 'Category IDs (comma-separated, will replace existing)'
                },
                sizeIds: { 
                  type: 'string',
                  description: 'Size IDs (comma-separated, will replace existing)'
                },
                variantIds: { 
                  type: 'string',
                  description: 'Variant IDs (comma-separated, will replace existing)'
                },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  },
                  description: 'Product images (will be added to existing)'
                }
              }
            }
          }
        }
      };
    }
  });
}