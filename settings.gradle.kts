rootProject.name = "localchat2"
include("server", "logic", ":server:webclient")
project(":server:webclient").projectDir = file("server/src/webclient")
