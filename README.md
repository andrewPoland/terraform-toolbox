# terraform-toolbox
The goal of this project is to provide loosely coupled terraform vsts extensions. The idea is to provide each command independently to reduce the configuration size of each task. At the end a user should be able to deploy an environment and extract the terraform outputs to VSTS variables.

Initially I plan to break the project down into the following tasks.

### Terraform Toolbox - Download Terraform
Since VSTS hosted agents do not contain the terraform executable the first step is to provide a task which will download the .exe.

*Inputs*:

- Version : string
- Directory: string.

*outputs*: none.

I would advise using a VSTS variable to store the directory as this will be needed in subsequent steps.

### Terraform Tooolbox - Init
Terraform Init <sup name="init-ref">[1](#init-footnote)</sup> allows a user to setup the working environment. This command is safe to run multiple times. If you are running on a hosted environment it might benefit you to run this command in a separate pipe to prevent redundant runs.

*Inputs*:

- Terraform exe directory: string
- Terraform configuration directory: string
- Same directory: bool
- Use Azure backend: bool
  - Use inline configuration: bool
    - storage account name: string
    - container name: string
    - blob name: string (key in config)

*Outputs*: none

### Terraform Toolbox - Plan
Terraform plan <sup name="plan-ref">[2](#plan-footnote)</sup> allows a user to plan out what changes will take place when you apply terraform, for your configuration. If the infrastructure has already been created the plan command will output that no changes will take place, if the infrastructure doesn't exist or partially exists it will output what it's going to create.

This is useful when you want to verify that the changes you intend to make are what you will make. It would be common inside the CD pipeline to make a call to plan and then wait for approval of the output before continuing on to apply that plan. You could improve performance by parsing the output and only requiring manual approval when infrastructure changes are going to occur.

Currently the plan command will output the plan to a local file called tfplan, you can then add your own manual script to export this file for reviewing purposes in a separate task. I would like to eventually add a recommended approval process to use with this extension but this is currently out of scope.

*Inputs*:

- Terraform exe directory: string
- terraform configuration directory: string
- same directory: bool

*outputs*:

 - Plan variable name: string  (will be set to the path of the tfplan file created from terraform plan)

### Terraform Toolbox - Apply
Terraform apply <sup name="apply-ref">[3](#apply-footnote)</sup> applies the changes that were planned in the previous step. Since this is part of the automation pipeline it will be run with auto-approve, manual approval is expected to take place externally if required.

Terraform apply results in outputs which are defined inside your terrafrom output file. These outputs can then be mapped to VSTS variables, this allows you to use these outputs when configuring your applications. E.g you might use terraform to setup a database and a website, you can then set the connection string in the website using the variable when you deploy it in a subsequent release step.

The apply step can be configured via a configuration file or via inline variables. This is a decision that is left up to the user, personally I prefer to have a codebase which is environment independant and then deployment tool which contains all environment information.

I plan to make all output variables secret, while all outputs might not be secret, I think it would be safer making them secret to prevent accidents due to not being aware. If this is problematic raise an issue with reasoning and if it's good I'll make it match the terraform output visibility.  

*Inputs*:

- Terraform exe directory: string
- terraform configuration directory: string
- same directory: bool
- use inline configuration: bool
  - key values variables (CSV format - key1=value1, key2 = value2, ...)
- store outputs: bool
  - key value outputs (CSV format - VSTSName1=TerraformName1, VariableName2=TerraformOutput2, ...)


## Contributions
At this point in time I'm going to control contribution strictly as I figure out how I'm going to setup the project, once this is done I'll update this with how you should go about contributing, specific styles that I want to keep consistant e.t.c. If there is a bug or a small feature that you wish to add feel free to create a pull request. I advise raising an issue before doing this, in case the feature doesn't fit within the scope of this project.

## Requests
If there is a feature that you would like to request this can be done by creating an issue in github. I will then tag it as a feature-request. If I'm being too slow in implementing a feature that has been requested, feel free to review the contributions section above and create a pull request.

## footnotes

<b id="init-footnote"> 1 </b> https://www.terraform.io/docs/commands/init.html [↩](#init-ref)

<b id="plan-footnote"> 2 </b> https://www.terraform.io/docs/commands/plan.html [↩](#plan-ref)

<b id="plan-footnote"> 3 </b> https://www.terraform.io/docs/commands/apply.html [↩](#apply-ref)
