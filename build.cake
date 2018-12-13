#addin nuget:?package=Cake.Kudu.Client
#addin nuget:?package=Cake.Npm

string          StageCheckEnvVar= "Check Environment Name";
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
string          branchName      = Argument("branchName","");

var branchEnvironmentPairs = new Dictionary<string, string>()
{
    {"master","prod" },
    {"dev","develop" },
    {"develop","develop" }
};

string[] autoReleaseEnv = new []
{
    "prod"
};

string selectedEnv = string.Empty;

Task(StageDefault)
.IsDependentOn(StagePublish);

Task(StageCheckEnvVar)
.Does(()=>
{
    if(string.IsNullOrEmpty(branchName))
    {
        throw new Exception("Branch Name should be provided");
    }
    Console.WriteLine("Branch Name = " + branchName);

    if(branchEnvironmentPairs.ContainsKey(branchName))
    {
        selectedEnv = branchEnvironmentPairs[branchName];
    }

    Console.WriteLine("Selected Env = " + selectedEnv);
});

Task(StageClean)
.IsDependentOn(StageCheckEnvVar)
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
        if(!autoReleaseEnv.Contains(selectedEnv))
        {
            Console.WriteLine($"Release does not execute for this Env: {selectedEnv}");
            return;
        }
        IKuduClient kuduClient = KuduClient(baseUri, userName, password);
        kuduClient.ZipDeployDirectory(outputPath);
    });

RunTarget(StageDefault);