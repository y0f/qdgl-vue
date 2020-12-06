import request from '@/utils/request'

export function getTermList(){
  return request({
    url: '/term',
    method: 'get'
  })
}

export function createTerm(data){
  return request({
    url: '/term',
    method: 'post',
    data
  })
}

export function updateTerm(id, data){
  return request({
    url: '/term/'+id,
    method: 'put',
    data
  })
}

export function deleteTerm(id){
  return request({
    url: '/term/'+id,
    method: 'delete',
  })
}

export function filter(id){
  return request({
    url: '/term/'+id,
    method: 'get'
  })
}
