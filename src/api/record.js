import request from '@/utils/request'

export function getById(id){
  return request({
    url: '/record/'+id,
    method: 'get'
  })
}
