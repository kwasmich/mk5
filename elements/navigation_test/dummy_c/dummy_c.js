import { UIView } from "/base/ui-view.js";
import { Dummy } from "../dummy.js";



export class DummyC extends Dummy {}



UIView.define("dummy-c", DummyC, import.meta.url);
