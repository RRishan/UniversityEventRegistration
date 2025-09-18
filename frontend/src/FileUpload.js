import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    console.log("File ready to upload:", file);
    // TODO: send file to backend with FormData
  };

  return (
    <div className="border rounded p-4">
      <label className="block font-medium mb-2">Upload Event File</label>
      <input type="file" onChange={handleFileChange} />
      {file && <p className="text-sm mt-2">Selected: {file.name}</p>}
      <button
        type="button"
        onClick={handleUpload}
        className="mt-3 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
