plugins {
  id("org.siouan.frontend-jdk11") version "5.3.0"
}

frontend {
  nodeDistributionProvided.set(true)
  yarnEnabled.set(true)
  yarnVersion.set("1.22.5")
  assembleScript.set("run assemble")
  checkScript.set("run lint")
  cleanScript.set("run clean")
}
