import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs' //Subject is similar to an EventEmitter
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';

@Injectable({providedIn: 'root'})
export class PostService{
    private posts: Post[]= [];
    private postUpdated = new Subject<{posts: Post[], postCount: number}>();
    private httpClient: HttpClient;
    private POSTS_URL: string = environment.nodeUrl+'/api/posts/';
    
    constructor( httpClient: HttpClient, private router: Router){
        this.httpClient = httpClient;
    }

    getPosts(postsPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.httpClient.get<{message: string, posts: any, postCount: number}>(this.POSTS_URL+queryParams)
            //we get _id but we expect id so we do this extra transformation
            .pipe(
                map((postData) => {
                    return {
                        posts: postData.posts.map(post => {
                            return {
                                id: post._id,
                                title: post.title,
                                content: post.content,
                                imagePath: post.imagePath,
                                createdBy: post.createdBy, 
                                createdByEmail: post.createdByEmail,
                                likedBy: post.likedBy
                            };
                        }),
                        postCount: postData.postCount
                    };
                })
            )
            .subscribe((transformedPosts)=>{
                this.posts = transformedPosts.posts;
                this.postUpdated.next({posts: [...this.posts], postCount: transformedPosts.postCount});
            });
    }

    getPost(id: string){
        return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string, createdBy: string, createdByEmail: string}>(
            this.POSTS_URL+id
        );
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable();
    }

    addPost(title: string, content: string, image: File){
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        //remember this Express server happens to live at 0.0.0.0 we'll want to 
        //pass in a env variable at run time with the public IP of the Express server
        this.httpClient.post<{message:string, post: Post}>(
            this.POSTS_URL, 
            postData
        )
        .subscribe((responseData) =>{
            this.router.navigate(['/']);
        });
    } 

    deletePost(postId: string){
        return this.httpClient.delete<{message: string}>(this.POSTS_URL+postId);
    }

    updatePost(id: string, title: string, content: string, image: File | string){
        let postData: FormData | Post;
        //file case
        if (typeof(image) === 'object'){
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        }
        else{
            //we handle the createdBy on the backend
            postData = { id: id, title: title, content: content, imagePath: image, createdBy: null, createdByEmail: null};
        }
        this.httpClient.put<{message: string, post: Post}>(this.POSTS_URL+id, postData)
            .subscribe((responseData) => {
                this.router.navigate(['/']);
            });        
    }
 
    likePost(post_id: string, liked: boolean){
        const postLiked = {liked: liked};
        return this.httpClient.put<{message: string}>(this.POSTS_URL+'likePost/'+post_id, postLiked);
    }
}