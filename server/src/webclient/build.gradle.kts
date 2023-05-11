plugins {
  id("org.siouan.frontend-jdk11") version "5.3.0"
}

frontend {
  nodeDistributionProvided.set(false)
  nodeVersion.set("18.15.0")
  yarnEnabled.set(true)
  yarnVersion.set("1.22.5")
}
