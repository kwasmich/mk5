import { UIView } from "/base/ui-view.js";
import { Dummy } from "../dummy.js";



export class PrimaryView extends Dummy {}



UIView.define("primary-view", PrimaryView, import.meta.url);
