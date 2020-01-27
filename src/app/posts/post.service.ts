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
    private postUpdated = new Subject<Post[]>();
    private httpClient: HttpClient;
    //the nodeServerAddress is the IP address of the node server relative to the client. (using the docker name wont work because angular runs on the CLIENT)
    ///0.0.0.0 wont work on work computer if running node on linux academy because the server isnt at localhost
    private nodeServerAddress: string = environment.nodeUrl;

    constructor( httpClient: HttpClient, private router: Router){
        this.httpClient = httpClient;
    }

    getPosts(){
        this.httpClient.get<{message: string, posts: any}>(this.nodeServerAddress+'/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        imagePath: post.imagePath
                    };
                })
            }))
            .subscribe((transformedPosts)=>{
                this.posts = transformedPosts;
                this.postUpdated.next([...this.posts]);
            });
    }

    getPost(id: string){
        return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string}>(
            this.nodeServerAddress+'/api/posts/'+id
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
            this.nodeServerAddress+'/api/posts', 
            postData
        )
        .subscribe((responseData) =>{
            const post: Post = {
                id: responseData.post.id,
                title: title,
                content: content,
                imagePath: responseData.post.imagePath
            }
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }

    deletePost(postId: string){
        this.httpClient.delete<{message: string}>(this.nodeServerAddress+'/api/posts/'+postId)
        .subscribe((responseData) => {
            this.posts = this.posts.filter(post => post.id !== postId);
            this.postUpdated.next([...this.posts]);
        });
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
            postData = { id: id, title: title, content: content, imagePath: image};
        }
        this.httpClient.put<{message: string, post: Post}>(this.nodeServerAddress+'/api/posts/'+id, postData)
            .subscribe((responseData) => {
                const post: Post = { id: id, title: title, content: content, 
                    imagePath: responseData.post.imagePath
                };
                const updatedIndex = this.posts.findIndex(p => p.id === post.id);
                this.posts[updatedIndex] = post;
                this.postUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });        
    }
}