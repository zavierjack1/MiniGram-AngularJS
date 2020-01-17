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
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
    }
}