import request from '@/utils/request'

export function getTaskList(){
  return request({
    url: '/task',
    method: 'get'
  })
}

export function createTask(data){
  return request({
    url: '/task',
    method: 'post',
    data
  })
}

export function updateTask(id, data){
  return request({
    url: '/task/'+id,
    method: 'put',
    data
  })
}

export function deleteTask(id){
  return request({
    url: '/task/'+id,
    method: 'delete',
  })
}

export function filter(id){
  return request({
    url: '/task/'+id,
    method: 'get'
  })
}
