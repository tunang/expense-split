export const ApiConstant = {
    auth: {
      login: '/auth/login',
      register: '/auth/signup',
      logout: '/auth/logout',
      refreshToken: '/auth/refresh-token',
      me: '/auth/me',
    },
    groupMember: {
        getMembers: '/group-member/:groupId',
    },
    //Client API
    group: {
        getGroups: '/group',
        getGroupById: '/group/:id',
        createGroup: '/group/create-group/',
        deleteGroup: '/group/delete-group/:groupId',
        editGroup: '/group/edit-group/:groupId',
    },


  };
  

  