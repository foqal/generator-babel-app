
import {getInfo} from "./info";
<%- imports %>

function run(args) {

    const info = getInfo();
<%- body %>
}


<%- footer %>
