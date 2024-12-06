import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuoteCreation = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
      "https://crafto.app/crafto/v1.0/media/assignment/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data[0].url;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const mediaUrl = await handleImageUpload();

    try {
      const response = await fetch(
        "https://assignment.stage.crafto.app/postQuote",
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, mediaUrl }),
        }
      );
      if (response.ok) {
        navigate("/quotes");
      } else {
        alert("Failed to create quote.");
      }
    } catch (error) {
      alert("An error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <textarea
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter quote text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="file"
        className="mb-4"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleSubmit}
        className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Create Quote
      </button>
    </div>
  );
};

export default QuoteCreation;
