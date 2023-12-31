# yt-video-summarizer

a Node.js based Firefox extension that summarizes youtube videos using the HuggingFace Inference API.

## Dependencies

* [Express.js](https://expressjs.com/)
* [youtube-transcript](https://www.npmjs.com/package/youtube-transcript?activeTab=readme)
* [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)

### Model

currently using the following Longformer Encoder-Decoder model: [pszemraj/led-base-book-summary](https://huggingface.co/pszemraj/led-base-book-summary)

## Setup

install Hugging Face Inference Library
```base
$ npm install @huggingface/inference
```

create HuggingFace API key environment variable
```bash
$ export HF_API_KEY=YOUR_API_KEY
```

run the app
```bash
$ node app
```

<p align="center">
  <img src="https://github.com/zvoverman/yt-video-summarizer/blob/main/image.png?raw=true" />
</p>

