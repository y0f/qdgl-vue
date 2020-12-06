import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/admin',
    method: 'get',
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getUserList(data) {
  return request({
    url: '/user?page='+data.page+'&limit='+data.limit,
    method: 'get'
  })
}

export function createUser(data){
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function updateUser(uid, data){
  return request({
    url: '/user/'+uid,
    method: 'put',
    data
  })
}

export function deleteUser(uid){
  return request({
    url: '/user/'+uid,
    method: 'delete',
  })
}

export function filter(id){
  return request({
    url: '/user/'+id,
    method: 'get'
  })
}
