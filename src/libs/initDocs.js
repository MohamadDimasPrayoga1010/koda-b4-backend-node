import expressJsdocSwagger from "express-jsdoc-swagger";

export function initDocs(app) {
  const options = {
    info: {
      title: "API Coffeeder",
      version: "1.0.0",
      description: "Dokumentasi API backend Coffeeder",
    },
    baseDir: process.cwd(),              
    filesPattern: "./src/controllers/*.js",  
    swaggerUIPath: "/api-docs",
    exposeSwaggerUI: true,
  };

  expressJsdocSwagger(app)(options);
}
