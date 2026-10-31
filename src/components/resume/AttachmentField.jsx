export function AttachmentField({ items = [], editing, onUpload, onRemove }) {
    const isImg = (a) => /^image\//.test(a.mime || "");
    return (
        <div className="resume-field-group resume-field-full">
            <label>Attachments (photo / PDF, max 5 MB)</label>

            <div className="attach-list">
                {items.length === 0 && !editing && (
                    <span className="attach-empty">No files attached</span>
                )}
                {items.map((a) => (
                    <div className="attach-chip" key={a.id}>
                        <a href={a.url} target="_blank" rel="noopener noreferrer">
                            {isImg(a) ? <img src={a.url} alt="" /> : <span className="attach-pdf">PDF</span>}
                            <span className="attach-name">{a.name}</span>
                        </a>
                        {editing && (
                            <button type="button" onClick={() => onRemove(a)}>✕</button>
                        )}
                    </div>
                ))}
            </div>

            {editing && (
                <label className="attach-add">
                    + Add file
                    <input
                        type="file"
                        hidden
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        onChange={(e) => {
                            const f = e.target.files && e.target.files[0];
                            if (f) onUpload(f);
                            e.target.value = "";
                        }}
                    />
                </label>
            )}
        </div>
    );
}
