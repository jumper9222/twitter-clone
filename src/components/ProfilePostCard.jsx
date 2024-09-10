import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"
import { Button, Col, Image, Row } from "react-bootstrap"

export default function ProfilePostCard({ content, postId }) {
    const [likes, setLikes] = useState([]);
    // const [postLiked, setPostLiked] = useState(false);

    const token = localStorage.getItem("authToken");
    const decode = jwtDecode(token);
    const userId = decode.id;

    const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167J1b2_400x400.jpg"
    const BASE_URL = 'https://bed45cb5-ed4b-48d5-89ba-1db743b377c5-00-2b6irl612ik23.sisko.replit.dev'

    const fetchLikes = (postId) => {
        const abortController = new AbortController();

        fetch(`${BASE_URL}/likes/posts/${postId}`, { signal: abortController.signal })
            .then((response) => response.json())
            .then((data) => { setLikes(data) })
            .catch((error) => console.error("Error: ", error))

        return () => {
            abortController.abort();
        }
    }

    useEffect(() => {
        fetchLikes(postId);
    }, [postId])

    const isLiked = likes.some((like) => like.user_id === userId)

    const handleLike = () => (isLiked ? removeFromLikes() : addToLikes())

    const addToLikes = () => {
        axios.post(`${BASE_URL}/likes`, {
            user_id: userId,
            post_id: postId,
        })
            .then((response) => {
                setLikes([...likes, { ...response.data, likes_id: response.data.id }])
            })
            .catch((error) => { console.error("Error:", error) })
    }

    const removeFromLikes = () => {
        const like = likes.find((like) => like.user_id === userId);
        if (like) {
            axios.put(`${BASE_URL}/likes/${userId}/${postId}`)
                .then(() => {
                    setLikes(likes.filter((likeItem) => likeItem.user_id !== userId));
                })
                .catch((error) => console.error("Error: ", error));
        }
    }
    // const likePost = () => {
    //     const data = {
    //         post_id: postId,
    //         user_id: userId
    //     }

    //     const abortController = new AbortController();

    //     const handleSuccess = (response => {
    //         fetchLikes(postId);
    //         console.log("Success: ", response)

    //     });

    //     const handleError = (error => {
    //         if (error.name !== 'AbortError') {
    //             console.error("Error: ", error)
    //         }
    //     });

    //     const sendRequest = async () => {
    //         try {
    //             const response = await (postLiked
    //                 ? axios.delete(`https://bed45cb5-ed4b-48d5-89ba-1db743b377c5-00-2b6irl612ik23.sisko.replit.dev/delete`, { data: data, signal: abortController.signal })
    //                     .then((response) => {
    //                         setLikes(likes - 1)
    //                         setPostLiked(!postLiked)
    //                         handleSuccess(response.data)
    //                     })
    //                 : axios.post(`https://bed45cb5-ed4b-48d5-89ba-1db743b377c5-00-2b6irl612ik23.sisko.replit.dev/likes`, data, { signal: abortController.signal })
    //                     .then((response) => {
    //                         setLikes(likes + 1)
    //                         setPostLiked(!postLiked)
    //                         handleSuccess(response.data)
    //                     })
    //             )
    //         } catch (error) {
    //             handleError(error)
    //         }
    //     }

    //     sendRequest();

    //     return () => {
    //         abortController.abort();
    //     }
    // }


    return (
        <Row
            className="p-3"
            style={{
                borderTop: "1px solid #D3D3D3",
                borderBottom: " 1px solid #D3D3D3"
            }}
        >
            <Col sm={1}>
                <Image src={pic} fluid roundedCircle />
            </Col>

            <Col>
                <strong>Haris</strong>
                <span>@haris.samingan · Apr 16</span>
                <p>{content}</p>
                <div className="d-flex justify-content-between">
                    <Button variant="light">
                        <i className="bi bi-chat"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-repeat"></i>
                    </Button>
                    <Button variant="light" onClick={handleLike}>
                        <i className={isLiked ? "bi bi-heart-fill text-danger" : "bi bi-heart"}></i> {likes.length}
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-garph-up"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-upload"></i>
                    </Button>
                </div>
            </Col>
        </Row>
    )
}