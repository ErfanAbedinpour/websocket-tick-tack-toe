import { Actions } from "../constant/actions.enum";

export interface IWsResponse {
    action: Actions;
    [meta: string]: string | boolean
}