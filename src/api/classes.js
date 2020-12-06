import request from '@/utils/request'

export function getClassesList(){
  return request({
    url: '/classes',
    method: 'get'
  })
}

export function createClasses(data){
  return request({
    url: '/classes',
    method: 'post',
    data
  })
}

export function updateClasses(id, data){
  return request({
    url: '/classes/'+id,
    method: 'put',
    data
  })
}

export function deleteClasses(id){
  return request({
    url: '/classes/'+id,
    method: 'delete',
  })
}

export function filter(id){
  return request({
    url: '/classes/'+id,
    method: 'get'
  })
}
