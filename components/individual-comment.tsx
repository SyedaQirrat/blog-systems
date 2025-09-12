import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Comment } from "@/lib/types"; // Corrected import from lib/types

interface IndividualCommentProps {
  comment: Comment;
}

const IndividualComment = ({ comment }: IndividualCommentProps) => {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src="/placeholder-user.jpg" alt={comment.authorName} />
        <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{comment.authorName}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.submittedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndividualComment;