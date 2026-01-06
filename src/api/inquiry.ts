import { api } from "./axios.ts";

// Inquiry(문의) 데이터의 생김새를 정의합니다. (이미 있던 내용)
export interface Inquiry {
    id: number;
    title: string;
    content: string;
    answer?: string; // 답변이 없을 수도 있으니 ?(물음표)를 붙입니다.
    isAnswered: boolean; // 답변 완료 여부 (true/false)
    answeredAt?: string; // 답변 달린 날짜
    createdAt: string; // 작성일
    author: {
        id: number; // 작성자 정보
        nickname: string;
        email: string;
        profileImage: string;
    };
}

interface InquiryListResponse {
    inquiries: Inquiry[];
    total: number;
    page: number;
    totalPages: number;
}

// 1:1 내 문의 목록 조회 API
// GET 방식은 queryString 으로 주소에 파라메터를 붙여서 전달해도 되지만,
// api.get( 주소, 옵션) 옵션 자리에 {params: { page, limit } } 를 넣어도 자동으로 쿼리 스트링을 붙여줌
export const fetchInquiries = async (page = 1, limit = 10) => {
    const response = await api.get<InquiryListResponse>(`/inquiries`, { params: { page, limit } });
    return response.data;
};

// 1:1 문의 등록 API
export const createInquiry = async (title: string, content: string) => {
    // post 요청은 데이터를 보낼 때 사용합니다.
    // 제목(title)과 내용(content)을 객체에 담아서 서버로 보냅니다.
    const response = await api.post<Inquiry>("/inquiries", { title, content });
    return response.data;
};

// 1:1 문의 상세 API
export const fetchInquiryDetail = async (inquiryId: number) => {
    const response = await api.get<Inquiry>(`/inquiries/${inquiryId}`);
    return response.data;
};

// 1:1 문의 사항을 삭제 API
export const deleteInquiry = async (inquiryId: number) => {
    // delete 요청으로 해당 id의 글을 삭제해달라고 합니다.
    const response = await api.delete<{ message: string }>(`/inquiries/${inquiryId}`);
    return response.data;
};

// 1:1 문의 답변 삭제 API
export const deleteInquiryAnswer = async (inquiryId: number) => {
    const response = await api.delete<{ message: string }>(`/inquiries/${inquiryId}/answer`);
    return response.data;
};

// 1:1 문의 수정 API
export const updateInquiry = async (inquiryId: number, data: { title: string; content: string }) => {
    const response = await api.patch<Inquiry>(`/inquiries/${inquiryId}`, data);
    return response.data;
};
