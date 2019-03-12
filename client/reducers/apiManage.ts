import * as ActionTypes from '../actions/apiManage'

function apiList(state:object, action) {
  switch (action.type) {
    case ActionTypes.GET_API_LIST_REQUEST:
      return {
        ...state,
        isFetching:true,
      }
    case ActionTypes.GET_API_LIST_SUCCESS:
      console.log(action);
      return {
        ...state,
        isFetching:false,
        list: action.response.result.data.content,
        total: action.response.result.data.totalElements,
      }
    case ActionTypes.GET_API_LIST_FAILURE:
      return {
        ...state,
        isFetching:false,
        list: [],
      }
  }
}

const apiManage = (state = {
  apiList: {
    list: [],
    isFetching: false,
    total: 0
  },
}, action) => {
  return {
    apiList: apiList(state.apiList, action),
  }
}

export default apiManage

