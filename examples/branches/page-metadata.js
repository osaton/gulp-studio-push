<%
var branchesData = Site.getBranchesData('studio-folder://5807aedb2b089f6b6f44cfaf/');
var branchesObj = {};

branchesObj[''] = '';
branchesData.branches.forEach(function(branch) {
  if(branch !== 'master') {
    branchesObj[branch] = branch;
  }  
});

%>
{ 
  "publicBranch": {
    "control" : "dropdown", 
    "params" : { 
      "label" : "Public branch, select empty for default (master)",
      "values": <%+ JSON.stringify(branchesObj) %>
    }, 
    "security" : { 
      "type" : "alphanum", 
      "required" : false 
    }
  }
}