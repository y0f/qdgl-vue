import request from '@/utils/request'

export function getCourseList(){
  return request({
    url: '/course',
    method: 'get'
  })
}

export function createCourse(data){
  return request({
    url: '/course',
    method: 'post',
    data
  })
}

export function updateCourse(id, data){
  return request({
    url: '/course/'+id,
    method: 'put',
    data
  })
}

export function deleteCourse(id){
  return request({
    url: '/course/'+id,
    method: 'delete',
  })
}

export function filter(id){
  return request({
    url: '/course/'+id,
    method: 'get'
  })
}
