export const Comments = ({ comments }: { comments: any }) => {
    if (!comments.length) {
        return null;
    }
    return (
        <div className='flex flex-col space-y-3'>
        {comments.map((comment: any) => (
            <div key={comment.id} className='flex space-x-3'>
            <div className='w-10 h-10 bg-blue-900 rounded-full'></div>
            <div className='flex flex-col space-y-1'>
                <div className='flex items-center space-x-2'>
                <p className='font-bold'>{comment.username}</p>
                <p className='text-gray-500 text-sm'>{comment.date}</p>
                </div>
                <p>{comment.body}</p>
            </div>
            </div>
        ))}
        </div>
    );
};