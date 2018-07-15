#addin nuget:?package=Cake.Kudu.Client
#addin nuget:?package=Cake.Npm


string          StageClean      = "Clean";
string          StageInstall    = "Install";
string          StageBuild      = "Build";
string          StagePublish    = "Publish";
string          StageDefault    = "Finish";

string          ngEnvDefault    = "azure";
string          outputPath      = "./dist";

string          ngEnv           = Argument("env", ngEnvDefault);
string          baseUri         = Argument("azure_uri", ""); //https://{yoursite}.scm.azurewebsites.net
string          userName        = Argument("azure_uname", "");
string          password        = Argument("azure_pass","");

Task(StageDefault)
.IsDependentOn(StagePublish);

Task(StageClean)
    .Does(()=>
    {
        CleanDirectory(outputPath);
    });

Task(StageInstall)
    .IsDependentOn(StageClean)
    .Does( ()=>
    {
        NpmInstall();
    });

Task(StageBuild)
    .IsDependentOn(StageInstall)
    .Does( ()=> 
    {
        string runScript = "build";
        if(!string.IsNullOrEmpty(ngEnv))
        {
            runScript += ":" + ngEnv;
        }
        
        NpmRunScript(runScript);
    });

Task(StagePublish)
    .IsDependentOn(StageBuild)
    .Does(()=>
    {
        IKuduClient kuduClient = KuduClient(baseUri, userName, password);
        kuduClient.ZipDeployDirectory(outputPath);
    });

RunTarget(StageDefault);