import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs' //Subject is similar to an EventEmitter
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostService{
    private posts: Post[]= [];
    private postUpdated = new Subject<Post[]>();
    private httpClient: HttpClient;

    constructor( httpClient: HttpClient){
        this.httpClient = httpClient;
    }

    getPosts(){
        this.httpClient.get<{message: string, posts: Post[]}>('http://0.0.0.0:8081/api/posts')
            .subscribe((postData)=>{
                this.posts = postData.posts;
                this.postUpdated.next(this.posts);
            });
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    addPost(post: Post){
        //remember this Express server happens to live at 0.0.0.0 we'll want to 
        //pass in a env variable at run time with the public IP of the Express server
        this.httpClient.post<{message:string}>('http://0.0.0.0:8081/api/posts', post)
        .subscribe((responseData) =>{
            console.log(responseData.message);
            //push new post to local posts array only if HTTP call works
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
        });
    }
}