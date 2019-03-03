import ajax from '@ajax'
 var users = function(){
    const data = ajax.get('users')
    return data.then(r =>
      (r.data|| []).map(o=>({
        "id": o.id,
        "name": o.name,
        "phone": o.phone,
        "email": o.email,
        "age": o.age,
        "discrp": o.discrp
      }))
    )       
 }

var companies = function(){
    const data =  ajax.get('companies')
    return data.then(r => (r.data||[].map(o=>({
        "id": o.id,
        "name": o.name
    }))))
}

var gruopTime = function(){
    const data = ajax.get('groupTime')
    return data.then(r => (
        (r.data || []).map(o => ({
            "id": o.id,
            "startTime": o.startTime,
            "endTime": o.endTime
        }))
    ))
}
module.exports = {
    users,
    companies,
    gruopTime
}