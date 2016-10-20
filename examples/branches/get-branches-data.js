'use strict';

// Get the id part
let folderId = folderRef.replace(/^studio-folder:\/\/([a-z0-9\-_]*)\//i, '$1');

let res = {
  folderId: folderId,
  postName: 'branch--' + folderId,
  branches: [],
  currentBranch: null
}

let postedBranch = Post && Post[res.postName];
let selectedBranch = 'master'; // Default

// Save posted branch to cookie and use that value
if(postedBranch) {
  Stage.setCookie(res.postName, postedBranch);
  selectedBranch = postedBranch

  // Or use already stored value
} else if(Cookie[res.postName]) {
  selectedBranch = Cookie[res.postName];
}

// But only in admin mode
res.currentBranch = Stage.admin ? selectedBranch : 'master';

res.branches = $.cache('branches--' + folderId, function () {
  let folders = folderRef.getFolders();
  let branches = [];

  for(let i=0, l=folders.length; i<l; i++) {
    branches.push(folders[i].name);
  }

  return branches;
}, Stage.admin ? 10 : 300);

return res;
