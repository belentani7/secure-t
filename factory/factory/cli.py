import click

from . import pipeline


@click.group()
def main():
    """Fábrica de contenido Secure-T (AGPLv3, 100% open)."""


@main.command()
@click.option("--scale", type=click.Choice(["smoke", "medium", "giga"]), default="smoke")
@click.option("--programs", default="ciberseguridad")
def run(scale, programs):
    """Genera contenido. giga = corre local/self-hosted, nunca en CI (disco)."""
    pipeline.run(programs.split(","), scale)


@main.command()
def stats():
    pipeline.stats_cmd()
