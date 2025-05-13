import { NotificationType } from "../../../models/NotificationType";

export type Displays = { [key in NotificationType]: JSX.Element }
