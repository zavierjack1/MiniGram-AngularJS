import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs' //Subject is similar to an EventEmitter
import { map } from 'rxjs/operators' //
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Injectable({providedIn: 'root'})
export class PostService{
    private posts: Post[]= [];
    private postUpdated = new Subject<Post[]>();
    private httpClient: HttpClient;

    constructor( httpClient: HttpClient){
        this.httpClient = httpClient;
    }

    getPosts(){
        //this.httpClient.get<{message: string, posts: Post[]}>('http://0.0.0.0:8081/api/posts')
        this.httpClient.get<{message: string, posts: any}>('http://0.0.0.0:8081/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content
                    };
                })
            }))
            .subscribe((transformedPosts)=>{
                this.posts = transformedPosts;
                this.postUpdated.next([...this.posts]);
            });
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    addPost(post: Post){
        //remember this Express server happens to live at 0.0.0.0 we'll want to 
        //pass in a env variable at run time with the public IP of the Express server
        this.httpClient.post<{message:string, postId:string}>('http://0.0.0.0:8081/api/posts', post)
        .subscribe((responseData) =>{
            console.log(responseData.message);
            const id = responseData.postId;
            post.id = id;
            //push new post to local posts array only if HTTP call works
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: String){
        console.log("postId: "+postId);
        this.httpClient.delete<{message: string}>('http://0.0.0.0:8081/api/posts/'+postId)
        .subscribe((responseData) => {
            console.log(responseData.message);
            this.posts = this.posts.filter(post => post.id !== postId);
            this.postUpdated.next([...this.posts]);
        });
    }
}