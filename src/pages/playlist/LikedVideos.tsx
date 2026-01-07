import { useEffect, useState } from "react";
import { fetchLikedVideos, type Video } from "../../api/video.ts"; // 좋아요 API 가져오기
import { twMerge } from "tailwind-merge";
import VideoCard from "../../components/video/VideoCard.tsx";
import { MdThumbUp } from "react-icons/md"; // 따봉 아이콘

function LikedVideos() {
    // [1] 상태 관리 (영상 목록, 로딩 상태)
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    // [2] 컴포넌트가 시작되면 데이터를 불러옵니다.
    useEffect(() => {
        loadVideos().then(() => {});
    }, []);

    // [3] 좋아요 한 영상을 서버에서 가져오는 함수
    const loadVideos = async () => {
        try {
            const data = await fetchLikedVideos(); // 이번엔 좋아요 API 호출!
            setVideos(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">로딩 중...</div>;

    // [4] 좋아요 한 영상이 없을 때
    if (videos.length === 0) {
        return (
            <div className={twMerge(["flex", "flex-col", "items-center", "justify-center", "h-[50dvh]"])}>
                <MdThumbUp className="w-16 h-16 text-text-disabled mb-4" />
                <p className="text-lg text-text-disabled">좋아요를 표시한 동영상이 없습니다.</p>
            </div>
        );
    }

    // [5] 화면 렌더링
    return (
        <div className={twMerge(["p-4", "sm:p-6"])}>
            <h1 className={twMerge(["text-2xl", "font-bold", "mb-6", "flex", "items-center", "gap-3"])}>
                <MdThumbUp className="text-primary-main" /> 좋아요 표시한 동영상
            </h1>

            <div className={twMerge(["flex", "flex-wrap"])}>
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className={twMerge(["w-full", "sm:w-1/2", "md:w-1/3", "lg:w-1/4"], ["px-2", "mb-8"])}
                    >
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LikedVideos;