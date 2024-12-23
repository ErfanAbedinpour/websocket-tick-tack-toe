import { Actions } from "../constant/actions.enum";

export interface IWsRequest {
    action: Actions,
    clientId: string;
    [meta: string]: string;
}