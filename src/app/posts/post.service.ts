import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs' //Subject is similar to an EventEmitter

@Injectable({providedIn: 'root'})
export class PostService{
    private posts: Post[]= [];
    private postUpdated = new Subject<Post[]>();

    getPosts(){
        //if you send an actual pointer to the array it can be mutated from somewhere else?
        return [...this.posts];
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    addPost(post: Post){
        this.posts.push(post);
        //by pushing the posts changes to components that are listening we dont have to worry about constantly refreshing
        //rather we just push when something changes
        this.postUpdated.next(this.getPosts());
    }
}