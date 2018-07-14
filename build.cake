 #addin nuget:?package=Cake.Kudu.Client

string          StageInstallAngularCli  = "Install-AngularCLI";
string          StageClean              = "Clean";
string          StageInstall            = "Install";
string          StageBuild              = "Build";
string          StagePublish            = "Publish";

string          ngEnvDefault            = "azure";
string          outputPath              = "./dist";
FilePath        ngPath                  = Context.Tools.Resolve("ng.cmd");
FilePath        npmPath                 = Context.Tools.Resolve("npm.cmd");

string          ngEnv       = Argument("env", ngEnvDefault);
string          baseUri     = Argument("AZURE_URI", ""); //https://{yoursite}.scm.azurewebsites.net
string          userName    = Argument("AZURE_UNAME", "");
string          password    = Argument("AZURE_PASS","");

Action<FilePath, ProcessArgumentBuilder> Cmd => (path, args) => {
    var result = StartProcess(
        path,
        new ProcessSettings {
            Arguments = args
        });

    if(0 != result)
    {
        throw new Exception($"Failed to execute tool {path.GetFilename()} ({result})");
    }
};

Task(StageDefault)
.IsDependentOn(StagePublish);

Task(StageInstallAngularCli)
    .Does(() =>
    {
        if (ngPath != null && FileExists(ngPath))
        {
            Information("Found Angular CLI at {0}.", ngPath);
            return;
        }

        DirectoryPath ngDirectoryPath = MakeAbsolute(Directory("./Tools/ng"));

        EnsureDirectoryExists(ngDirectoryPath);

        Cmd(npmPath,
            new ProcessArgumentBuilder().Append("install")
                                        .Append("--prefix")
                                        .AppendQuoted(ngDirectoryPath.FullPath)
                                        .Append("@angular/cli")
        );
        ngPath = Context.Tools.Resolve("ng.cmd");
    });

Task(StageClean)
    .Does(()=>
    {
        CleanDirectory(outputPath);
    });

Task(StageInstall)
    .IsDependentOn(StageClean)
    .Does( ()=>
    {
        Cmd(npmPath, new ProcessArgumentBuilder().Append("install"));
    });

Task(StageBuild)
    .IsDependentOn(StageInstallAngularCli)
    .IsDependentOn(StageInstall)
    .Does( ()=> 
    {
        string runScript = "run build";
        if(!string.IsNullOrEmpty(ngEnv))
        {
            runScript += ":" + ngEnv;
        }
        
        Cmd(npmPath, new ProcessArgumentBuilder().Append(runScript));
    });

Task(StagePublish)
    .IsDependentOn(StageBuild)
    .Does(()=>
    {
        IKuduClient kuduClient = KuduClient(baseUri, userName, password);
        kuduClient.ZipDeployDirectory(outputPath);
    });

RunTarget(StageDefault);