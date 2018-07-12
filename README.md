# ProjectRenamer-UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.9.

You  can reach docker-container over ![this link](https://hub.docker.com/r/projectrenamer/projectrenamer-ui/) 

You  can reach live web sites over ![this link](https://project-renamer.azurewebsites.net/) 


## Development server

Run `ng serve` or `npm start` for a dev server . Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

If you use `vscode` and you have `Debugger for Chrome`, (after npm start or ng serve command) you can hit F5 and start debugging code.

# Using

After execution of `ng serve` or `npm start`, you can reach web page over `http://localhost:4200/`. When you supply required parameters, "Generate" button turns active. When hit that button, your desired repository is cloning and revised. After changing keywords, copy of changed repository contents are downloaded as a ZIP file.

![ui](https://preview.ibb.co/bK42YS/project_renamer_ui.png)

NOTE : There is input field at the bottom of page. Via this field, you can give information about what is end point of project-renamer-webapi.
Forexample: If you download [projectrenamer-web-api project code](https://github.com/ProjectRenamer/ProjectRenamer-WebApi) and run it locally, you can fill `http://localhost:5000/`

![web-api-url](https://preview.ibb.co/k0o1Sn/web_api_url.png)
