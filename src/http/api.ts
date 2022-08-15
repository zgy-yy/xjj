import http from "./http"

export async function getData(){
    const url ='/'
    return http.get<{url:string,data:Blob}>(url,'').then(response =>{
        return response
    } )
}