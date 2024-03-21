# Youtube Clone 

**Deployment URL:** https://yt-web-client-wkjfq2shva-uc.a.run.app/

This is a simplified Youtube clone. It provides a skeleton of the Youtube UI with some of the core functionality. It allows a user to sign in using Oauth and then upload and view videos.

Broadly it follows neetcode.io's [Full Stack Development Course](https://neetcode.io/courses/full-stack-dev/0)

## High level architecture 

All components of the application are hosted on Google Cloud Services.

### Cloud Storage 

Cloud storage is used to host both raw and processed video files.

### Firestore 

Once a video is processed, Firestore is used to store the video's metadata. 

## Cloud Pub/Sub

Sends a message to the video processing workers when a video is uploaded so that the video can then be processed asyncronously. 

### Cloud Run 

Hosts video processing workers. When a video is uploaded and stored in Cloud Storage, the video processing worker receives a Pub/Sub message which will transcode the video using ffmpeg. The processed video is uploaded back to cloud storage. 

Cloud Run also hosts the web client.

### Firebase Functions 

Hosts a simple API that allows users to upload videos and retrieve video metadata. 


