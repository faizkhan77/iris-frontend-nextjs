import { useParams } from "react-router";

const ChatSessionPage = () => {
    const {id} = useParams()
  return (
    <div>
      Chat Session Id : {id}
    </div>
  );
};

export default ChatSessionPage;
