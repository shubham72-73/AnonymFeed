import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Removed CardDescription
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/user";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    if (typeof message._id !== "string") {
      toast({ title: "Invalid message ID" });
      return;
    }

    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
    toast({
      title: response.data.message,
    });
    onMessageDelete(message._id);
  };

  function formatDate(dateString: Date) {
    const date = new Date(dateString);

    const day = date.getUTCDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    const hours = date.getUTCHours(); // Changed from let to const
    const minutes = date.getUTCMinutes(); // Changed from let to const

    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const utcTime: string = `${formattedHours}:${formattedMinutes}`;

    function formatUTCTimeToLocalAMPM(utcTimeString: string) {
      const utcDate = new Date(`1970-01-01T${utcTimeString}Z`);
      const localTimeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return utcDate.toLocaleTimeString([], localTimeOptions);
    }

    const localTime = formatUTCTimeToLocalAMPM(utcTime);

    return `${day} ${month} ${year} ${localTime}`;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="w-full text-lg">{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-8 h-7 m-1 p-0 rounded-full">
              <X className="w-7"/>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                message and remove this data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p>{formatDate(message.createdAt)}</p>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
