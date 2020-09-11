plugins {
  id("org.siouan.frontend-jdk11") version "4.0.0"
}

frontend {
  nodeVersion.set("v12.18.3")
  nodeDistributionProvided.set(true)
  yarnVersion.set("v1.22.5")
  yarnDistributionProvided.set(true)
  assembleScript.set("run build4prod")
}
