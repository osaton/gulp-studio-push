'use strict';

// Get the id part
let folderId = folderRef.replace(/^studio-folder:\/\/([a-z0-9\-_]*)\//i, '$1');

let res = {
  folderId: folderId,
  postName: 'branch--' + folderId,
  branches: [],
  currentBranch: null,
  getDevPages: function () {
    let devPages = $.cache('branches-pages--' + folderId, function () {
      let pages = Stage.pages.get({'navi_id': 'primary'}, ['name', 'id', 'meta_data']);
      let devPages = [];
      
      let processPages = function(pages) {
        pages.forEach(function (page) {
          console.log(page);
        });
      }
      
      processPages(pages);
    }, Stage.admin ? 10 : 300);
  }
}

let postedBranch = Post && Post[res.postName];
let selectedBranch = 'master'; // Default

// Save posted branch to cookie and use that value
if(postedBranch) {
  Stage.setCookie(res.postName, postedBranch);
  selectedBranch = postedBranch
   
  // Or use already stored value
} else if(Cookie && Cookie[res.postName]) {
  selectedBranch = Cookie[res.postName];
}

// But only in admin mode
res.currentBranch = Stage.admin ? selectedBranch : 'master'; 

// Get branches
res.branches = $.cache('branches--' + folderId, function () {
  let folders = folderRef.getFolders();
  let branches = [];
  
  for(let i=0, l=folders.length; i<l; i++) {
    branches.push(folders[i].name);
  }
  
  return branches;
}, Stage.admin ? 10 : 300);

// If selected branch is no longer found, use master
if(res.branches.indexOf(res.currentBranch) === -1) {
  res.currentBranch = 'master';
  
  // And delete cookie if one exists
  Stage.deleteCookie(res.postName);
}

return res;