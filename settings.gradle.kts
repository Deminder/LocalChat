rootProject.name = "localchat"
include("server", "logic", ":server:webclient")
project(":server:webclient").projectDir = file("server/src/webclient")