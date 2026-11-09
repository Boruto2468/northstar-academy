import {ExternalLink,PlayCircle} from 'lucide-react';
import {videosFor} from '@/data/biologyVideos';
import type {BiologyVideo} from '@/data/biologyVideos';
function VideoLinks({videos}:{videos:BiologyVideo[]}){
 return videos.length?<div className="northstar-watch-list">{videos.map(v=><a key={v.url} className="northstar-watch-video" href={v.url} target="_blank" rel="noopener noreferrer"><PlayCircle size={25}/><span><strong>{v.title}</strong><small>{v.channel} · {v.length}</small></span><ExternalLink size={15}/></a>)}</div>:<p className="northstar-watch-missing">No verified video for this section yet. Use the written lesson and exercises for now.</p>;
}
export default function BiologyWatch({topicId,subtopicId}:{topicId:string;subtopicId?:string}){
 return <section className="northstar-watch" aria-label="Biology watch section"><span className="eyebrow">WATCH · OPTIONAL VIDEO REVISION</span><h3>Watch the explanation on YouTube</h3><p>Short, curriculum-matched clips. These links open YouTube in a new tab; videos are not embedded.</p>
 {subtopicId?<><h4>Current section</h4><VideoLinks videos={videosFor(topicId,subtopicId)}/></>:null}
 <h4>Topic overview</h4><VideoLinks videos={videosFor(topicId)}/>
 </section>;
}
