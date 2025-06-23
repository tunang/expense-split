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

    invitation: {
        getReceivedInvitations: '/invitation/received',
        getSentInvitations: '/invitation/group/:groupId/sent',
        createInvitation: '/invitation/group/:groupId/member/:userId',
        handleInvitation: '/invitation/group/:groupId/request/:requestId',
    },

    groupJoinRequest: {
        getJoinRequest: '/join-request/:groupId',
        createJoinRequest: '/join-request/:groupId',
        handleJoinRequest: '/join-request/group/:groupId/request/:requestId',
    },
    
    expense: {
        getExpense: '/expense/:groupId',
        createExpense: '/expense/create-expense',
        deleteExpense: '/expense/delete-expense/:id',
    },

  };
  

  